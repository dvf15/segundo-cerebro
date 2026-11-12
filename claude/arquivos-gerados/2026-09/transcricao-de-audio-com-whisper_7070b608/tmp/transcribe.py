import wave, numpy as np, sherpa_onnx, sys, time

wav = "/tmp/audio.wav"
with wave.open(wav) as w:
    sr = w.getframerate()
    data = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)/32768.0
print("sr", sr, "dur", len(data)/sr, file=sys.stderr)

vad_cfg = sherpa_onnx.VadModelConfig()
vad_cfg.silero_vad.model = "/tmp/silero_vad.onnx"
vad_cfg.silero_vad.threshold = 0.5
vad_cfg.silero_vad.min_silence_duration = 0.4
vad_cfg.silero_vad.min_speech_duration = 0.2
vad_cfg.silero_vad.max_speech_duration = 25.0
vad_cfg.sample_rate = 16000
vad = sherpa_onnx.VoiceActivityDetector(vad_cfg, buffer_size_in_seconds=200)

rec = sherpa_onnx.OfflineRecognizer.from_whisper(
    encoder="/tmp/sherpa-onnx-whisper-small/small-encoder.int8.onnx",
    decoder="/tmp/sherpa-onnx-whisper-small/small-decoder.int8.onnx",
    tokens="/tmp/sherpa-onnx-whisper-small/small-tokens.txt",
    language="pt", task="transcribe", num_threads=4,
)

segments = []
win = 512
for i in range(0, len(data), win):
    vad.accept_waveform(data[i:i+win])
    while not vad.empty():
        segments.append((vad.front.start/sr, vad.front.samples))
        vad.pop()
vad.flush()
while not vad.empty():
    segments.append((vad.front.start/sr, vad.front.samples))
    vad.pop()

print("segments:", len(segments), file=sys.stderr)
t0 = time.time()
out = []
for n, (start, samples) in enumerate(segments):
    s = rec.create_stream()
    s.accept_waveform(16000, np.asarray(samples, dtype=np.float32))
    rec.decode_stream(s)
    txt = s.result.text.strip()
    end = start + len(samples)/16000
    out.append((start, end, txt))
    print(f"[{start:7.2f}-{end:7.2f}] {txt}", flush=True)
    print(f"  ..{n+1}/{len(segments)} elapsed {time.time()-t0:.0f}s", file=sys.stderr)

with open("/tmp/transcript.txt", "w") as f:
    for start, end, txt in out:
        m1, s1 = divmod(int(start), 60); m2, s2 = divmod(int(end), 60)
        f.write(f"[{m1:02d}:{s1:02d} - {m2:02d}:{s2:02d}] {txt}\n")
print("done", file=sys.stderr)
