<script>
    let codiceISA = "";
    let password = "";

    async function Login(event) {
        event.preventDefault(); 
        try {
            const response = await fetch("https://bookstoreonline.onrender.com/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ codiceISA, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert("Errore: " + errorData.message);
                return;
            }

            const data = await response.json();
            console.log("Token ricevuto:", data.token);
            } catch (error) {
            console.error("Errore nella fetch:", error);
        }
    }
</script>

<h1>FORM DI LOGIN</h1>

<form class="login-form" on:submit|preventDefault={Login}>
    <label for="codiceISA">Codice ISA</label>
    <input
        id="codiceISA"
        type="text"
        bind:value={codiceISA}
        placeholder="Inserisssssci il codice ISA"
    />
    <br><br>

    <label for="password">Password</label>
    <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="Inserisci la password"
    />
    <br><br>

    <button type="submit">Accedi</button>
</form>
