function formatUpVotes(num) {
  let result = num.toString();
  if (num > 999 && num < 999999) {
    // handle thousands
    result = `${(Math.round((num / 1000) * 10)) / 10}k`;
  } else if (num > 999999) {
    // handle millions
    result = `${(Math.round((num / 1000000) * 10)) / 10}m`; 
  }
  return result;
}

export default formatUpVotes;
