 
// sirve para configurar la url del webapp de google sheets y el token de administrador
// esta parte la investigue para poder guardar los datos del registro en un google sheet
// y poder acceder a ellos desde el webapp de google sheets
 
// GOOGLE_SHEET_WEBAPP_URL ---> es la "dirección" a la que le mandamos los datos
// (como si fuera la URL de una API, pero en realidad es mi Apps Script)
const GOOGLE_SHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyLcsFHa0MiTjibY9oqVB5xYwI0c7C02fIsUsDXQrHK87l_aZUswtf0fiAmHwNTUns3ag/exec';
 
// ADMIN_TOKEN ---> es como una "contraseña secreta" que solo el admin conoce,
// para que nadie más pueda pedirle a mi Apps Script la lista completa de usuarios
const ADMIN_TOKEN = 'aza';
 