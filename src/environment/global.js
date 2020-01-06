export const Global = {
  strapiURL: 'https://amy-production.herokuapp.com',
  getHeader: token => { return { headers: { Authorization: `Bearer ${token}` } } },
  print: _ => { console.log('PRINTING METHOD') }
}