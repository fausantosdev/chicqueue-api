import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

import hbs from 'nodemailer-express-handlebars'
import { resolve } from 'path'

import nodemailerConfig from '../config/nodemailer'

const { host, port, secure, auth } = nodemailerConfig

const transport = nodemailer.createTransport({
  host,
  port,
  secure,
  auth
} satisfies SMTPTransport.Options)
/**
 *
 * Problem:
 * No overload matches this call.
 * The last overload gave the following error.
 * Argument of type '{ host: string | undefined; port: string | undefined; secure: string | undefined; auth: { user: string | undefined; pass: string | undefined; }; }' is not assignable to parameter of type 'TransportOptions | Transport<unknown>'.
 * Object literal may only specify known properties, and 'host' does not exist in type 'TransportOptions | Transport<unknown>'.ts(2769)
 *
 * Resolution:
 * The all-important bit was casting it as a SMTPTransport.Options type, as by default it was expecting the configuration to be a Transport | TransportOptions type
 *
 * */
transport.use('compile', hbs({
  viewEngine: {
    extname: '.handlebars',
    partialsDir: resolve('src', 'app', 'resources', 'mail'),
    defaultLayout: false
  },
  viewPath: resolve('src', 'app', 'resources', 'mail'),
  extName: '.handlebars'
}))

export default transport
