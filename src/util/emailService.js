import transporter from "./emailConfig.js";

// 1. Email when user creates a game
const sendGameCreatedEmail = async (userEmail, gameName, gameId) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: `Your Game "${gameName}" Has Been Created!`,
    html: `
      <h2>Game Created Successfully!</h2>
      <p>Hi,</p>
      <p>Your game <strong>${gameName}</strong> has been created successfully.</p>
      <p>Game ID: ${gameId}</p>
      <p>You can now invite other players to join your game.</p>
      <br/>
      <a href="${process.env.APP_URL}/games/${gameId}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Game</a>
      <br/>
      <p>Happy gaming!</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Game created email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending game created email:', error);
  }
};

const sendUserJoinedGameEmail = async (creatorEmail, joinedUserEmail, joinedUserName, gameName, gameId) => {

  const creatorMailOptions = {
    from: process.env.SMTP_FROM,
    to: creatorEmail,
    subject: `${joinedUserName} Joined Your Game!`,
    html: `
    <h2>New Player Alert!</h2>
      <p>Hi,</p>
      <p><strong>${joinedUserName}</strong> has joined your game <strong>${gameName}</strong>!</p>
      <p>Total players in game: Check your game dashboard for details.</p>
      <br/>
      <a href="${process.env.APP_URL}/games/${gameId}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Game</a>
      <br/>
      <p>Get ready to play!</p>
    `
  }


  const joinedUserMailOptions = {
    from: process.env.SMTP_FROM,
    to: joinedUserEmail,
    subject: `You've Joined the Game "${gameName}"!`,
    html: `
      <h2>Welcome to ${gameName}!</h2>
      <p>Hi ${joinedUserName},</p>
      <p>You've successfully joined the game <strong>${gameName}</strong>!</p>
      <p>Get ready to play with other players.</p>
      <br/>
      <a href="${process.env.APP_URL}/games/${gameId}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Game</a>
      <br/>
      <p>See you in the game!</p>
    `
  };

  try {
    await transporter.sendMail(creatorMailOptions);
    console.log('Game creator notification email sent to:', creatorEmail);

    await transporter.sendMail(joinedUserMailOptions);
    console.log('Game joined confirmation email sent to:', joinedUserEmail);
  } catch (error) {
    console.error('Error sending user joined game email:', error);
  }

}

const sendGameInvitationEmail = async (invitedUserEmail, inviterName, gameName, gameId, invitationLink) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: invitedUserEmail,
    subject: `${inviterName} Invited You to Play "${gameName}"!`,
    html: `
      <h2>Game Invitation!</h2>
      <p>Hi,</p>
      <p><strong>${inviterName}</strong> has invited you to join their game <strong>${gameName}</strong>!</p>
      <p>Click the button below to accept the invitation and start playing:</p>
      <br/>
      <a href="${invitationLink}" style="background-color: #FF9800; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
      <br/>
      <p>Or copy this link: ${invitationLink}</p>
      <br/>
      <p>Looking forward to playing with you!</p>
      <p>- ${inviterName}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Invitation email sent to:', invitedUserEmail);
  } catch (error) {
    console.error('Error sending invitation email:', error);
  }
};

module.exports = {
  sendGameCreatedEmail,
  sendUserJoinedGameEmail,
  sendGameInvitationEmail
};
