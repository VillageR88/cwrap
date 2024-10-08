const currentPath = window.location.pathname;
const skeletonApiUrl = `routes/${currentPath}/skeleton.json`;

export default async function loadSkeletonSource() {
	const url = `${skeletonApiUrl}?v=${new Date().getTime()}`;
	try {
		const response = await fetch(url);
		const jsonObj = await response.json();
		if (typeof jsonObj !== "object" || jsonObj === null) {
			throw new Error("jsonObj is not an object");
		}
		return jsonObj;
	} catch (error) {
		console.error("Error loading skeleton source:", error);
		throw error;
	}
}
