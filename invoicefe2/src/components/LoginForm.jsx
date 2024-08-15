import { useState } from 'react';
function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('API/Auth/Authenticate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({ username, password }), 
        });
        const data = await response.json();
        if (response.ok) {
            //store token
            localStorage.setItem('token', data.token);
            alert('Login Successful!');
        } else {
            alert('Authentication Failed');
            
            console.log('Authentication Failed');
        }
    }

    return (
        // Notes for self: Type password will display '******' when data is typed
        // vlaue refers to the variable that controls the field. From the docs 'force the input's value to match the state variable'
        // onChange => update the state variable whenever chars are typed in
        // Whatever is saved in the vars when submit is checked will be validated by above. 
        <form onSubmit={handleSubmit}>
        
            <input type='text' value={username} onChange={e => setUsername(e.target.value)}  placeholder='User name'/>
            <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
            <button type='submit'>Login!</button>
        </form>

    );
}

export default LoginForm;