"""
Unit tests for a simple calculator example
These tests demonstrate unit testing without connecting to the existing codebase
"""
import pytest


class Calculator:
    """Simple calculator class for demonstration"""
    
    def add(self, a, b):
        """Add two numbers"""
        return a + b
    
    def subtract(self, a, b):
        """Subtract b from a"""
        return a - b
    
    def multiply(self, a, b):
        """Multiply two numbers"""
        return a * b
    
    def divide(self, a, b):
        """Divide a by b"""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b


class TestCalculator:
    """Unit tests for Calculator class"""
    
    @pytest.fixture
    def calculator(self):
        """Fixture to create a calculator instance"""
        return Calculator()
    
    def test_add_positive_numbers(self, calculator):
        """Test adding two positive numbers"""
        result = calculator.add(5, 3)
        assert result == 8
    
    def test_add_negative_numbers(self, calculator):
        """Test adding two negative numbers"""
        result = calculator.add(-5, -3)
        assert result == -8
    
    def test_subtract_positive_numbers(self, calculator):
        """Test subtracting two positive numbers"""
        result = calculator.subtract(10, 4)
        assert result == 6
    
    def test_multiply_numbers(self, calculator):
        """Test multiplying two numbers"""
        result = calculator.multiply(6, 7)
        assert result == 42
    
    def test_divide_numbers(self, calculator):
        """Test dividing two numbers"""
        result = calculator.divide(10, 2)
        assert result == 5.0
    
    def test_divide_by_zero_raises_error(self, calculator):
        """Test that dividing by zero raises an error"""
        with pytest.raises(ValueError, match="Cannot divide by zero"):
            calculator.divide(10, 0)
    
    @pytest.mark.parametrize("a,b,expected", [
        (1, 1, 2),
        (0, 0, 0),
        (-1, 1, 0),
        (100, 200, 300),
    ])
    def test_add_parametrized(self, calculator, a, b, expected):
        """Test addition with multiple parameter sets"""
        result = calculator.add(a, b)
        assert result == expected
