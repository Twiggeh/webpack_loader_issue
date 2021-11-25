import { useEffect } from 'react';

import { setupApp } from '../../wireWebapp/src/script/main/app';

const Body = () => {
	useEffect(() => {
		setupApp();
	}, []);

	return <div>hi</div>;
};

export default Body;
