# -*- coding: utf-8 -*-
"""Testes do motor (biblioteca padrão). Rode: python3 motor/test_engine.py"""
import os, sys, unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine import Motor

TAXA = "Redução da Taxa de Transferência"
CT50 = {"aluguel_mensal": 20000, "taxa_padrao_amm": 3, "taxa_neg_amm": 1.5}   # desconto 50%
CT60 = {"aluguel_mensal": 20000, "taxa_padrao_amm": 3, "taxa_neg_amm": 1.2}   # desconto 60%


class TestAlcada(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m = Motor()

    def test_marca_A_somente_diretoria(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino", {"grau_estrategico": "A", "num_pracas": 1}, CT50)
        self.assertEqual(r["alcada"], "Diretoria de Operações")

    def test_marca_B_somente_diretoria(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino", {"grau_estrategico": "B", "num_pracas": 1}, CT50)
        self.assertEqual(r["alcada"], "Diretoria de Operações")

    def test_padrao_1praca_ate_50_superintendente(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino", {"grau_estrategico": "Padrao", "num_pracas": 1}, CT50)
        self.assertEqual(r["desconto_pct"], 50.0)
        self.assertEqual(r["alcada"], "Superintendente")

    def test_padrao_1praca_acima_50_sobe(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino", {"grau_estrategico": "Padrao", "num_pracas": 1}, CT60)
        self.assertEqual(r["alcada"], "Diretoria de Operações")

    def test_padrao_multipraca_sem_superintendente(self):
        # 2 praças já tira a alçada do superintendente
        r = self.m.decidir(TAXA, "Vestuário Feminino",
                           {"grau_estrategico": "Padrao", "num_pracas": 2, "dentro_portfolio": True}, CT50)
        self.assertEqual(r["alcada"], "Diretor de Portfólio")

    def test_diretor_ate_4_no_portfolio(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino",
                           {"grau_estrategico": "Padrao", "num_pracas": 4, "dentro_portfolio": True}, CT50)
        self.assertEqual(r["alcada"], "Diretor de Portfólio")

    def test_diretor_sem_alcada_acima_4(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino",
                           {"grau_estrategico": "Padrao", "num_pracas": 5, "dentro_portfolio": True}, CT50)
        self.assertEqual(r["alcada"], "Diretoria de Operações")

    def test_diretor_sem_alcada_fora_portfolio(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino",
                           {"grau_estrategico": "Padrao", "num_pracas": 3, "dentro_portfolio": False}, CT50)
        self.assertEqual(r["alcada"], "Diretoria de Operações")

    def test_limite_duro(self):
        r = self.m.decidir("Anticorrupção", "Cosméticos", {"grau_estrategico": "Padrao", "num_pracas": 1})
        self.assertEqual(r["classe"], "Limite")
        self.assertIn("INEGOCIÁVEL", r["veredito"])
        self.assertEqual(r["alcada"], "Diretoria de Operações")

    def test_custo_por_loja_e_total(self):
        r = self.m.decidir(TAXA, "Vestuário Feminino",
                           {"grau_estrategico": "Padrao", "num_pracas": 3, "dentro_portfolio": True}, CT50)
        self.assertEqual(r["custo_por_loja"], 30000.0)   # 1,5 aluguel × R$ 20.000
        self.assertEqual(r["custo_total"], 90000.0)      # × 3 praças

    def test_desconto_multa(self):
        r = self.m.decidir("Alteração de Multa Rescisória", "Fast Food",
                           {"grau_estrategico": "Padrao", "num_pracas": 1},
                           {"aluguel_mensal": 15000, "multa_padrao_amm": 3, "multa_neg_amm": 2})
        self.assertAlmostEqual(r["desconto_pct"], 33.3, places=1)
        self.assertEqual(r["alcada"], "Superintendente")


if __name__ == "__main__":
    unittest.main(verbosity=2)
