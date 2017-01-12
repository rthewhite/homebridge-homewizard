import 'babel-polyfill';
import dgram from 'dgram';
import http from 'http';

export class NotificationListener {

  DEFAULT_PERIOD = 1;

  constructor(log, config, api, eventManager) {

    if (config && config.pushServer && config.pushServer.udp) {
      const socket = dgram.createSocket({type: 'udp4', reuseAddr: true});

      socket.on('error', function (err) {
        log(`NotificationListener UDP server error:\n${err.stack}`);
        socket.close();
      });

      socket.on('listening', function () {
        const address = socket.address();
        log(`Listening UDP ${address.family} ${address.address}:${address.port}`);
      });

      socket.on('message', function (message, rinfo) {
        log(`UDP request from : ${rinfo.address}:${rinfo.port} ${message}`);
        api.clearCache();
        eventManager.emit('refresh', message);
      });
      socket.bind(config.pushServer.udp);
    }

    if (config && config.pushServer && config.pushServer.http) {
      http.createServer(function (request, response) {
        const clientAdress = (request.headers['x-forwarded-for'] || '').split(',')[0] || request.connection.remoteAddress;
        log(`Http request from : ${clientAdress} ${request.method} ${request.url}`);
        api.clearCache();
        eventManager.refreshAllGetters();
        response.writeHead(200);
        response.end('Done');
      }).listen(config.pushServer.http, function() {
        log(`Listening HTTP:${config.pushServer.http}`);
      });
    }

    const period = config && config.pushServer && config.pushServer.period ? config.pushServer.period : this.DEFAULT_PERIOD;
    log(`Automatic refresh every ${period} mn`);
    setInterval(function () {
      log(`Refresh...`);
      eventManager.refreshAllGetters();
    }, 60 * 1000 * period);
  }
}
