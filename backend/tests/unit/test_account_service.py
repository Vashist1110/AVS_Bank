"""
Unit tests for account service mock
Demonstrates testing business logic without database connections
"""
import pytest
from datetime import datetime
from unittest.mock import Mock, MagicMock


class Account:
    """Mock Account class for testing"""
    
    def __init__(self, account_id, balance=0.0):
        self.account_id = account_id
        self.balance = balance
        self.transactions = []
    
    def deposit(self, amount):
        """Deposit money into account"""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.balance += amount
        self.transactions.append({
            'type': 'deposit',
            'amount': amount,
            'timestamp': datetime.now()
        })
        return self.balance
    
    def withdraw(self, amount):
        """Withdraw money from account"""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        self.transactions.append({
            'type': 'withdrawal',
            'amount': amount,
            'timestamp': datetime.now()
        })
        return self.balance
    
    def get_balance(self):
        """Get current balance"""
        return self.balance


class TestAccount:
    """Unit tests for Account class"""
    
    @pytest.fixture
    def account(self):
        """Create a test account"""
        return Account(account_id="TEST123", balance=1000.0)
    
    def test_account_creation(self):
        """Test creating a new account"""
        account = Account(account_id="NEW123")
        assert account.account_id == "NEW123"
        assert account.balance == 0.0
        assert len(account.transactions) == 0
    
    def test_deposit_success(self, account):
        """Test successful deposit"""
        new_balance = account.deposit(500.0)
        assert new_balance == 1500.0
        assert account.get_balance() == 1500.0
        assert len(account.transactions) == 1
        assert account.transactions[0]['type'] == 'deposit'
        assert account.transactions[0]['amount'] == 500.0
    
    def test_deposit_negative_amount(self, account):
        """Test depositing negative amount raises error"""
        with pytest.raises(ValueError, match="Deposit amount must be positive"):
            account.deposit(-100.0)
    
    def test_deposit_zero_amount(self, account):
        """Test depositing zero amount raises error"""
        with pytest.raises(ValueError, match="Deposit amount must be positive"):
            account.deposit(0)
    
    def test_withdraw_success(self, account):
        """Test successful withdrawal"""
        new_balance = account.withdraw(300.0)
        assert new_balance == 700.0
        assert account.get_balance() == 700.0
        assert len(account.transactions) == 1
        assert account.transactions[0]['type'] == 'withdrawal'
    
    def test_withdraw_insufficient_funds(self, account):
        """Test withdrawing more than balance raises error"""
        with pytest.raises(ValueError, match="Insufficient funds"):
            account.withdraw(2000.0)
    
    def test_withdraw_negative_amount(self, account):
        """Test withdrawing negative amount raises error"""
        with pytest.raises(ValueError, match="Withdrawal amount must be positive"):
            account.withdraw(-50.0)
    
    def test_multiple_transactions(self, account):
        """Test multiple deposits and withdrawals"""
        account.deposit(200.0)  # 1200
        account.withdraw(100.0)  # 1100
        account.deposit(300.0)  # 1400
        account.withdraw(400.0)  # 1000
        
        assert account.get_balance() == 1000.0
        assert len(account.transactions) == 4
    
    @pytest.mark.parametrize("initial_balance,deposit,withdraw,expected", [
        (1000, 500, 200, 1300),
        (0, 1000, 500, 500),
        (5000, 2000, 3000, 4000),
    ])
    def test_balance_after_transactions(self, initial_balance, deposit, withdraw, expected):
        """Test balance calculation with parametrized inputs"""
        account = Account(account_id="TEST", balance=initial_balance)
        account.deposit(deposit)
        account.withdraw(withdraw)
        assert account.get_balance() == expected
