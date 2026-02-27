export function computeAchievements({
  totalGames = 0,
  totalScore = 0,
  highScore = 0,
  totalBananas = 0,
  fastestDuration = null,
}) {
  const achievements = [];

  // Banana collection milestones
  if (totalBananas >= 10) achievements.push('Banana Beginner');
  if (totalBananas >= 100) achievements.push('Banana Enthusiast');
  if (totalBananas >= 1000) achievements.push('Banana Master');

  // High score milestones
  if (highScore >= 500) achievements.push('High Roller');
  if (highScore >= 1000) achievements.push('Elite Runner');

  // Games played
  if (totalGames >= 10) achievements.push('Getting Warm');
  if (totalGames >= 50) achievements.push('Marathoner');

  // Consistency
  if (totalScore >= 5000) achievements.push('Consistent Performer');
  if (totalScore >= 20000) achievements.push('Legend in the Making');

  // Speed
  if (fastestDuration != null && fastestDuration > 0 && fastestDuration <= 60)
    achievements.push('Sprinter');

  return achievements;
}
