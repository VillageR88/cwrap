/**
 * @type {import('./_globals.js')}
 */
import getElementPath from "./getElementPath.js";
import highlightSelectedElement from "./highlightSelectedElement.js";
import nestElementInElement from "./nestElementInElement.js";

//TODO drag and drop
export default function populateTreeView() {
	const previewDocument =
		global.id.preview.contentDocument ||
		global.id.preview.contentWindow.document;
	const treeView = global.id.previewTree;
	treeView.innerHTML = "";
	const bodyElement = previewDocument.body;
	const tree = document.createElement("ul");

	// Function to create tree structure recursively
	function createTree(element, parentListItem) {
		if (element.children.length > 0) {
			const subList = document.createElement("ul");
			for (const child of element.children) {
				const subListItem = document.createElement("li");
				const subText = document.createTextNode(child.tagName.toLowerCase());
				const newButton = document.createElement("button");
				newButton.classList.add("mediumButtons");
				newButton.draggable = true;
				newButton.addEventListener("click", () => {
					global.id.elementSelect.value = getElementPath(child);
					global.id.nameHelper.textContent = getElementPath(child);
					highlightSelectedElement();
				});
				newButton.addEventListener("dragstart", (event) => {
					event.dataTransfer.setData("text/plain", event.target.value);
				});
				newButton.addEventListener("dragover", (event) => {
					event.preventDefault();
				});
				newButton.addEventListener("drop", (event) => {
					event.preventDefault();
					const draggedValue = event.dataTransfer.getData("text/plain");
					nestElementInElement(draggedValue, event.target.value);
				});
				// Use the imported getElementPath function
				newButton.value = getElementPath(child);
				newButton.appendChild(subText);
				subListItem.appendChild(newButton);
				subList.appendChild(subListItem);
				createTree(child, subListItem);
			}
			parentListItem.appendChild(subList);
		}
	}

	// Create the root list item for the body element
	const rootListItem = document.createElement("li");
	const bodyText = document.createTextNode(bodyElement.tagName.toLowerCase());
	const bodyButton = document.createElement("button");
	bodyButton.classList.add("mediumButtons");
	bodyButton.addEventListener("click", () => {
		global.id.elementSelect.value = "body";
		global.id.nameHelper.textContent = "body";
		highlightSelectedElement();
	});
	bodyButton.appendChild(bodyText);
	bodyButton.value = "body";

	rootListItem.appendChild(bodyButton);
	tree.appendChild(rootListItem);

	// Start creating the tree from the children of the body element
	createTree(bodyElement, rootListItem);

	treeView.appendChild(tree);
}
