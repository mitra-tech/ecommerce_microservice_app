import Winston, {Logger} from 'winston';
import { ElasticsearchTransformer, ElasticsearchTransport, LogData, TransformedData } from 'winston-elasticsearch';


const esTransformer = (logdata : LogData) : TransformedData => {
  return ElasticsearchTransformer(logdata);
}

// passing the url to elasticsearch node
export const winstonLogger = (elasticSearchNode: string, name: string, level: string) : Logger => {
  const options = {
    console: {
      level,
      handleExceptions: true,
      json: false,
      colorize: true
    },
    elasticsearch: {
      level,
      transformer: esTransformer,
      clientOpts: {
        node: elasticSearchNode,
        log: level,
        maxRetries: 2,
        requestTimeout: 10000,
        sniffOnStart: false
      }
    }
  };

  const esTransport: ElasticsearchTransport = new ElasticsearchTransport(options.elasticsearch);

  const logger : Logger = Winston.createLogger({
    exitOnError: false,
    defaultMeta: { service: name },
    transports: [new Winston.transports.Console(options.console), esTransport]
  });

  return logger;
}
