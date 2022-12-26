/* Mensajes de sockets */
const {io} = require('../index');
const {comprobarJWT} = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado, grabarMensaje} = require('../controllers/socket');

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

    /* Ingresar al usuario a una sala especifica */
    /* Sala Global, client.id, 638e4a2ec358dc2d8c4727a8 */
    client.join(uid);

    /* Escuchar del cliente el mensaje-personal */
    client.on('mensaje-personal', async (payload) => {
        // Todo: Grabar mensaje
        await grabarMensaje(payload)
        io.to(payload.para).emit('mensaje-personal', payload);
    });


    client.on('disconnect', () => {
        usuarioDesconectado(uid);
        console.log('Cliente desconectado');
    });

    // client.on('mensaje', (payload) => {
    //     console.log('mensaje:', payload);

    //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    // })
});