let data = [{
    name: 'bam_dq4qd',
    value: 4
  },
  {
    name: 'bam_dq4qb',
    value: 8
  },
  {
    name: 'bam_dq4qc',
    value: 13
  },
  {
    name: 'bam_dq4qd',
    value: 41
  },
  {
    name: 'bam_dq4qc',
    value: 15
  }];
  
  let names = [];
  let dataWithoutDuplicateNames = [];
  let filteredData = data.filter(userData => {
                 if(names.includes(userData.name) ){
                 
                 } else {
                 names.push(userData.name);
                 dataWithoutDuplicateNames.push(userData);
                 }
  })
  console.log(dataWithoutDuplicateNames);