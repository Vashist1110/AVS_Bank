"""
Unit tests for user validation functions
These tests are standalone and don't connect to the existing codebase
"""
import pytest
import re


class UserValidator:
    """Example validator class for user input"""
    
    @staticmethod
    def validate_email(email):
        """Validate email format"""
        if not email or not isinstance(email, str):
            return False
        
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_password(password):
        """
        Validate password strength
        Requirements: 
        - At least 8 characters
        - Contains uppercase and lowercase
        - Contains at least one digit
        """
        if not password or not isinstance(password, str):
            return False
        
        if len(password) < 8:
            return False
        
        has_upper = any(c.isupper() for c in password)
        has_lower = any(c.islower() for c in password)
        has_digit = any(c.isdigit() for c in password)
        
        return has_upper and has_lower and has_digit
    
    @staticmethod
    def validate_phone(phone):
        """Validate phone number (10 digits)"""
        if not phone or not isinstance(phone, str):
            return False
        
        # Remove common separators
        cleaned = phone.replace('-', '').replace(' ', '').replace('(', '').replace(')', '')
        
        return len(cleaned) == 10 and cleaned.isdigit()


class TestUserValidator:
    """Unit tests for UserValidator"""
    
    def test_valid_email(self):
        """Test valid email addresses"""
        assert UserValidator.validate_email("user@example.com") is True
        assert UserValidator.validate_email("test.user@domain.co.uk") is True
        assert UserValidator.validate_email("user123@test-domain.com") is True
    
    def test_invalid_email(self):
        """Test invalid email addresses"""
        assert UserValidator.validate_email("") is False
        assert UserValidator.validate_email("not-an-email") is False
        assert UserValidator.validate_email("@example.com") is False
        assert UserValidator.validate_email("user@") is False
        assert UserValidator.validate_email(None) is False
        assert UserValidator.validate_email(123) is False
    
    def test_valid_password(self):
        """Test valid passwords"""
        assert UserValidator.validate_password("Password1") is True
        assert UserValidator.validate_password("SecurePass123") is True
        assert UserValidator.validate_password("MyP@ssw0rd") is True
    
    def test_invalid_password(self):
        """Test invalid passwords"""
        assert UserValidator.validate_password("short1A") is False  # Too short
        assert UserValidator.validate_password("alllowercase1") is False  # No uppercase
        assert UserValidator.validate_password("ALLUPPERCASE1") is False  # No lowercase
        assert UserValidator.validate_password("NoDigitsHere") is False  # No digits
        assert UserValidator.validate_password("") is False
        assert UserValidator.validate_password(None) is False
    
    def test_valid_phone(self):
        """Test valid phone numbers"""
        assert UserValidator.validate_phone("1234567890") is True
        assert UserValidator.validate_phone("123-456-7890") is True
        assert UserValidator.validate_phone("(123) 456-7890") is True
    
    def test_invalid_phone(self):
        """Test invalid phone numbers"""
        assert UserValidator.validate_phone("123") is False  # Too short
        assert UserValidator.validate_phone("12345678901") is False  # Too long
        assert UserValidator.validate_phone("abcdefghij") is False  # Not digits
        assert UserValidator.validate_phone("") is False
        assert UserValidator.validate_phone(None) is False
