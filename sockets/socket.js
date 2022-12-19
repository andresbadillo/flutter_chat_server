/* Mensajes de sockets */
const {io} = require('../index');
const {comprobarJWT} = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado} = require('../controllers/socket');

io.on('connection', client => {
    console.log('Cliente conectado');

    /* Obtener el JWT */
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);
    
    /* Verificar autenticacion */
    if (!valido) {
        return client.disconnect();
    }

    /* Cliente autenticado */
    usuarioConectado(uid);

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');
    });

    // client.on('mensaje', (payload) => {
    //     console.log('mensaje:', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    // })
});