import pytest
from internal.utils.security import hash_password, verify_password

# Test para probar las funciones de hashing y verificación de contraseñas
class TestPasswordHashing:

    def testHashPassword_NormalPassword_PasswordHashed(self):
        password = "mi_password_123"
        hashed = hash_password(password)

        assert hashed != password
        assert len(hashed) > 0

    def testHashPassword_HashPasswordTwice_DifferentHashes(self):
        password = "mi_password_123"
        hash1 = hash_password(password)
        hash2 = hash_password(password)

        assert hash1 != hash2

    def testVerifyPassword_CorrectPassword_True(self):
        password = "mi_password_123"
        hashed = hash_password(password)

        assert verify_password(password, hashed) is True

    def testVerifyPassword_IncorrectPassword_False(self):
        password = "mi_password_123"
        wrong_password = "password_incorrecta"
        hashed = hash_password(password)

        assert verify_password(wrong_password, hashed) is False

    def testVerifyPassword_EmptyPasswordIsValid_True(self):
        password = ""
        hashed = hash_password(password)

        assert verify_password(password, hashed) is True
