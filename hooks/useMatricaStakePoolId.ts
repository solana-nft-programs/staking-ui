// import { useRouter } from 'next/router'
// import { useState, useEffect } from 'react';
// import needle from 'needle';

// const useMatricaStakePoolId = () => {
//     const { query: { stakePoolId } } = useRouter();

//     const [data, setData] = useState(null);
//     const [isLoading, setLoading] = useState(true);

//     useEffect(() => {
//         setLoading(true);

//         needle('get', 'localhost:5001/api/staking/5gzLf8EBnNRdaaPdGWYZnG1GTbqHC7cmujEzkHJLtDFD')
//             .then(res => {
//                 console.log(res.body);
//                 setData(res.body);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.log('error');
//                 setData(null);
//                 setLoading(false);
//             })
//     })


//     console.log('in use matrica pool ')
//     console.log(stakePoolId);
//     console.log(data);
    
// };

// export default useMatricaStakePoolId;
export {};