import { promisify } from 'util';
import db from '../config/db.js';

const dbQuery = promisify(db.query).bind(db);

export default dbQuery;
