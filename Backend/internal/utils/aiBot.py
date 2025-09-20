#import os

#import ollama

#welcomeMessage = ollama.generate(model = os.getenv("AI_MODEL"), prompt = "Generame un saludo de bienvenida")
#def welcome():
#    print(welcomeMessage)