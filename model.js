const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('data/db.json');
const db = low(adapter);

function getUser(userId) {
  return db.get('users').find({ id: userId }).value();
}

function getTeam(teamId) {
  return db.get('teams').find({ id: teamId }).value();
}

/**
 * Add new chat and admin to database.
 */
module.exports.addNewChat = function(chatId, userId) {
  return new Promise((resolve, reject) => {
    // check if chat already exists
    if(db.get("chats").find({ id: chatId }).value() != undefined){
      resolve(false);
    } else {
      db.get("chats")
        .push({ id: chatId, teams: [], users: [{ id: userId }]})
        .write();
      
      resolve(true);
    }
  });
};

/**
 * Add score to a team.
 * @param {string} teamId - ID of the team to add the score.
 * @param {integer} score - Score to be added.
 * @param {integer} userId - ID of the user invoking this request.
 * @returns {object} - Updated team object.
 */
module.exports.addTeamScore = function(teamId, score, userId) {
  return new Promise((resolve, reject) => {
    const user = getUser(userId);
    const team = getTeam(teamId);

    if (user === undefined) {
      reject('Error adding score: invalid user');
      return;
    }
    
    if (team === undefined) {
      reject('Error adding score: invalid team id');
      return;
    }
    
    if (!Number.isInteger(score)) {
      reject('Error adding score: score not an integer');
      return;
    }
    
    db.get('teams')
      .find({ id: teamId })
      .set('score', team.score + score)
      .write();
    
    resolve({ team });
  });
};

/**
 * Add new user.
 *
 * @param {string} targetId - ID of  new user.
 * @param {integer} userId - ID of the user invoking this request.
 */
module.exports.addUser = function(targetId, userId) {
  return new Promise((resolve, reject) => {
    const user = getUser(userId);
    
    if (user === undefined) {
      reject('Error adding user: invalid user');
      return;
    }
    
    db.get('users')
      .push({ id: targetId })
      .write();
    
    resolve();
  });
};

/**
 * Get database.
 * @returns {array} - Array of objects, each is a team.
 */
module.exports.getTeamsModel = function() {
  return new Promise((resolve, reject) => {
    resolve(db.get('teams').value());
  });
};
