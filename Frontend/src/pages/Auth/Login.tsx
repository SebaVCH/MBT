import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link } from "react-router-dom";
import Input from "../../components/layouts/Inputs/Input";
import { validateEmail } from "../../utils/helper";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    
    // const navigate= useNavigate();

    interface HandleLoginEvent extends React.FormEvent<HTMLFormElement> {}

    const handleLogin = async (e: HandleLoginEvent): Promise<void> => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Por favor ingresa un correo válido");
            return;
        }

        if (!password) {
            setError("Por favor ingresa tu contraseña");
            return;
        }
        setError("");
        //login API
    }
    
    return (
        <AuthLayout>
            <div className="lg:w-[70%] h=3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Bienvenido</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    Por favor ingresa a tu cuenta
                </p>

                <form onSubmit={handleLogin}>
                    <Input 
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        label="Correo"
                        type="text"
                        placeholder="nombre@dominio.com"
                    />

                    <Input 
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        label="Contraseña"
                        type="password"
                        placeholder=""
                    />

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

                    <button type="submit" className="btn-primary">
                        INGRESAR
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        
                        <Link
                            className="font-medium text-primary underline" to="/signUp">
                            REGISTRARSE
                        </Link>
                    </p>

                </form>
            </div>
          
        </AuthLayout>
    )
}

export default Login;