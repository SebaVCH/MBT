import React, { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link } from "react-router-dom";
import Input from "../../components/layouts/Inputs/Input";
import { validateEmail } from "../../utils/helper";

const SignUp = () => {
    //const [profile, setProfile] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const[error, setError] = useState("");

    // const navigate= useNavigate();

    interface SignUpFormEvent extends React.FormEvent<HTMLFormElement> {}

    const handleSignUp = async (e: SignUpFormEvent) => {
        e.preventDefault();
        if (!fullName) {
            setError("Por favor ingresa tu nombre");
            return;
        }

        if (!validateEmail(email)) {
            setError("Por favor ingresa un correo válido");
            return;
        }
        if (!password) {
            setError("Por favor ingresa la contraseña");
            return;
        }
        setError("");
        //signUp API
    };

    return (
        <AuthLayout>
            <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">Crea tu cuenta</h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">   
                    Regístrate para empezar a administrar tus finanzas
                </p>

                <form onSubmit={handleSignUp}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                        value={fullName}
                        onChange={({target}) => setFullName(target.value)}
                        label="Nombre completo"
                        type="text"
                        placeholder="Tu nombre"
                    />

                    <Input 
                        value={email}
                        onChange={({target}) => setEmail(target.value)}
                        label="Correo"
                        type="text"
                        placeholder="nombre@dominio.com"
                    />

                    <Input 
                        value={password}
                        onChange={({target}) => setPassword(target.value)}
                        label="Contraseña"
                        type="password"
                        placeholder=""
                    />

                    </div> 

                    {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
                    
                    <button type="submit" className="btn-primary">
                        REGISTRARSE
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        ¿Ya tienes una cuenta? {' '}
                        <Link
                            className="font-medium text-primary underline" to="/login">
                            INICIAR SESIÓN
                        </Link>
                    </p> 
                </form>       
            </div>
        </AuthLayout>
    )
}

export default SignUp;