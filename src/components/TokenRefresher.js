import { useEffect, useState } from 'react'; // Eliminamos la importación de React
import { refreshToken } from '../api/authApi';

// Función para decodificar tokens JWT
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar el token:", e);
        return null;
    }
};

const TokenRefresher = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        const checkTokenExpiration = () => {
            const token = localStorage.getItem('token');
            const refreshTokenValue = localStorage.getItem('refreshToken');

            if (!token || !refreshTokenValue) {
                return;
            }

            const decodedToken = parseJwt(token);
            if (!decodedToken) {
                return;
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilExpiration = decodedToken.exp - currentTime;

            // Si el token expira en menos de 30 segundos, lo refrescamos
            if (timeUntilExpiration < 30) {
                refreshAccessToken(refreshTokenValue);
            }
        };

        const refreshAccessToken = async (refreshTokenValue) => {
            if (isRefreshing) return;

            const username = localStorage.getItem('username');
            if (!username || !refreshTokenValue) return;

            setIsRefreshing(true);
            try {
                console.log("⏰ Token de acceso próximo a expirar. Refrescando...");
                const response = await refreshToken({
                    username: username,
                    refreshToken: refreshTokenValue
                });

                // Guardar el nuevo token de acceso
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);

                console.log("✅ Token de acceso refrescado exitosamente");

                const newDecodedToken = parseJwt(response.token);
                if (newDecodedToken) {
                    console.log("🔑 Nuevo Access Token expira en:", new Date(newDecodedToken.exp * 1000).toLocaleString());
                    console.log("⏱️ Tiempo restante nuevo Access Token:", Math.floor((newDecodedToken.exp * 1000 - Date.now()) / 1000), "segundos");
                }
            } catch (error) {
                console.error("❌ Error al refrescar el token:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('username');
                window.location.href = '/';
            } finally {
                setIsRefreshing(false);
            }
        };


        // Verificar cada 10 segundos
        const interval = setInterval(checkTokenExpiration, 10000);

        return () => clearInterval(interval);
    }, [isRefreshing]);

    return null; // No renderiza nada
};

export default TokenRefresher;