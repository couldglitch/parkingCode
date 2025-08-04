document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});
async function getGoogleAppsScriptResponse() {
    const params = new URLSearchParams(window.location.search);
    const apiKey = params.get('api_key');
    const responseElement = document.getElementById('response');
    
    if (!apiKey) {
        responseElement.textContent = JSON.stringify({
            error: "Missing required parameter: api_key",
            timestamp: new Date().toISOString()
        }, null, 2);
        return;
    }

    params.delete('api_key');
    const scriptUrl = `https://script.google.com/macros/s/${apiKey}/exec?${params.toString()}`;

    try {
        const response = await fetch(scriptUrl, { 
            method: 'GET',
            redirect: 'follow'
        });
        
        const responseText = await response.text();
        
        try {
            // If response is valid JSON, display it directly
            const jsonResponse = JSON.parse(responseText);
            responseElement.textContent = JSON.stringify(jsonResponse, null, 2);
        } catch {
            // If response isn't JSON, wrap it in a JSON structure
            responseElement.textContent = JSON.stringify({
                response: responseText,
                status: response.status,
                timestamp: new Date().toISOString()
            }, null, 2);
        }
    } catch (error) {
        responseElement.textContent = JSON.stringify({
            error: error.message,
            type: error.name,
            timestamp: new Date().toISOString()
        }, null, 2);
    }
}

// Start the request when the page loads
document.addEventListener('DOMContentLoaded', getGoogleAppsScriptResponse);
