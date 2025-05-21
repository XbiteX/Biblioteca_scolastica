// place files you want to import through the `$lib` alias in this folder.

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isa");
    localStorage.removeItem("ruolo");

    console.log("Utente disconnesso");
    window.location.href = "/app/login";
}

export async function checkToken() {
    try{
        const result = await fetch('https://bookstoreonline.onrender.com/justVerifyToken', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
        });
        
        if (!result.ok){
            console.log("Token non valido, reindirizzando a login...");
            return false;
        }

        return true
    }catch(error){
        console.error('Errore durante la verifica del token:', error)
        return false
    }
}