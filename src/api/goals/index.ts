/** GOALS **/

// GET user active goals

// POST create a new goal (must check in DB no more than 10 entries)

// GET inactive (expired or completed) goals (for history page)

/** BOTH **/

// PUT update an existing active goal DETAILS only (e.g. color, name, tasks per week)

// DELETE goal (and DELETE all relation weekly goals)

// PUT goal completion (expired or completed) and then DELETE weekly goals (they'll no longer be needed)

/** WEEKLY **/
//TODO make sure to fetch DailyTasks as well and build array here

// GET user current active week goals

// GET all week goals for a SPECIFIED goal (never want to just blind fetch all week goals)

// PUT update current weekly goal (really it'll just be to mark a daily task as completed as well as title change)

// POST create new weekly goal (should always be autoamtic)

//? PUT updtae weekly goal staus?
