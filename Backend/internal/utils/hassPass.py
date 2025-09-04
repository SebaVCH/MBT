import bcrypt

# Encriptacion de contraseñas
def hassPassword(password) -> str:
    passwordHashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=16))
    return passwordHashed.decode('utf-8')