import knex from "knex";

const knexpg = knex({
  client: 'pg',
  version: '7.2',
  connection: {
    host : '172.28.254.72',
    port: 5777,
    user : 'ijro_read',
    password : 'ijro_read_2216',  
    database : 'ijro'
  }
});

export default knexpg;

// SELECT d.* from president_assignments.documents as d
// INNER JOIN president_assignments.tasks as t on d.id = t.document_id AND t.is_deleted is not true
// INNER JOIN president_assignments.task_recipients as tr on t.id = tr.task_id and tr.recipient_db_id = '599e5105cf1d7c338cb6ea6d'
// GROUP BY d.id
// ORDER BY d.created_at desc
// LIMIT 10;
