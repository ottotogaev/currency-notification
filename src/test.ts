import express, { Request, Response, NextFunction, Application } from 'express';

import knexPg from '../config/knexpg';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const knex = knexPg;

  // let result = await knexpg.select("username").from('users');
  // let task_1 = await knexPg('president_assignments.documents as d').select(`d.*`)
  //   .join(`president_assignments.tasks as t`, function () {
  //     this.on(`d.id`, `=`, `t.document_id`)
  //       .andOn(knexPg.raw(`t.is_deleted is not true`))
  //   })
  //   .join(`president_assignments.task_recipients as tr`, function () {
  //     this.on(`t.id`, `=`, `tr.task_id`)
  //       .andOn(knexPg.raw(`tr.recipient_db_id = '599e5105cf1d7c338cb6ea6d'`))
  //   })
  //   .groupBy(`d.id`)
  //   .orderBy(`d.created_at`, `desc`)
  //   .limit(10)
  /**
   *   
   -- # har biri organizatsiyaning userlar soni va documentlar soni
      SELECT org.id, org.name_uz as OrganName,
       (select count(documents.id) from documents where db_id = org.id) as documentCount, (select count(users.id) from users where db_id = org.id) as countUsers
FROM organizations as org
ORDER BY countUsers desc;
   */
  const task_2 = await knex
    .select([
      'org.id',
      'org.name_uz as OrgName',
      knex.raw(`(select count(documents.id) from documents where db_id = org.id) as documentCount`),
      knex.raw(`(select count(users.id) from users where db_id = org.id) as  countUsers`)
    ])
    .from('organizations as org')
    .orderByRaw('countUsers desc')
    .limit(20);

  const query = await knex
    .select([
      'org.id',
      'org.name_uz as OrganName',
      knex.raw('(select count(documents.id) from documents where db_id = org.id) as documentCount'),
      knex.raw('(select count(users.id) from users where db_id = org.id) as countUsers')
    ])
    .from('organizations as org')
    .orderByRaw('countUsers DESC')

  // console.log(task_2);

  return res.status(200).json(task_2)

  // knex.from('users').innerJoin('accounts', 'users.id', 'accounts.user_id')

  // SELECT d.* from president_assignments.documents as d
  // INNER JOIN president_assignments.tasks as t on d.id = t.document_id AND t.is_deleted is not true
  // INNER JOIN president_assignments.task_recipients as tr on t.id = tr.task_id and tr.recipient_db_id = '599e5105cf1d7c338cb6ea6d'
  // GROUP BY d.id
  // ORDER BY d.created_at desc
  // LIMIT 10;

});

async function startup() {
  try {
    app.listen(PORT, () => {
      console.log("App listen and runnig", PORT);
    });
  } catch (e) {
    console.log(e);
  }
}

startup();


// const pg = require('knex')({
//   client: 'pg',
//   connection: process.env.PG_CONNECTION_STRING,
//   searchPath: ['knex', 'public'],
// });



// knex.table = (table) => knex
