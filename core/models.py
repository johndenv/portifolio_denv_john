from django.db import models

class Loan(models.Model):
    value_loan = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor do empréstimo") # Para valor de dinheiro
    interest_mounth = models.DecimalField(max_digits=5, decimal_places=4, verbose_name="Juros mensal") # para valor em porcentagem.
    
    @property
    def daily_rate(self):
        # calcula a taxa diaria sem salvar no banco de dados
        interest_float = float(self.interest_mounth)
        return (1 + interest_float) ** (1/30) -1
    
    @property
    def percentage_interest_rate(self):
        # Retorna a taxa diária formatada em string com 4 casas decimais
        return f"{self.daily_rate * 100:.4f}%"
    
    @property
    def juros_diario_reais(self):
        # Calcula o valor do juro diário em reais baseado no valor do empréstimo
        return float(self.value_loan) * self.daily_rate

    def __str__(self):
        return f"Empréstimo de R$ {self.value_loan} - Taxa Diária: {self.percentage_interest_rate}"
    
    
    
