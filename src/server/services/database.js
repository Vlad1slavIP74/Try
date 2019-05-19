import promise from 'bluebird'
import globalConfig from '../../config'

let options = { promiseLib: promise }
let pgp = require('pg-promise')(options)

let DB = pgp(globalConfig.db)

export default DB
