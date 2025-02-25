export function getApiUrl() {
  const { origin } = window.location;
  if (origin === 'http://localhost:3001') {
    return 'http://localhost:3000';
  } else if (origin === 'https://www.mbti-database.com') {
    return 'https://api.mbti-database.com';
  }
}
