/* Intercepts ```mermaid fenced code blocks before Expressive Code processes them,
   turning them into a plain <pre> container that the client-side Mermaid renderer
   picks up (see the mermaid <script> in Layout.astro). Must run before astro-expressive-code
   in the remarkPlugins pipeline, otherwise the diagram source gets syntax-highlighted
   as plain text instead of rendered. */

function escapeHtml(str) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

export function remarkMermaid() {
	return (tree) => {
		function walk(node, parent, index) {
			if (node.type === "code" && node.lang === "mermaid" && parent) {
				parent.children[index] = {
					type: "html",
					value: `<pre class="mermaid-diagram" data-mermaid>${escapeHtml(node.value)}</pre>`,
				};
				return;
			}
			if (node.children) {
				for (let i = 0; i < node.children.length; i++) {
					walk(node.children[i], node, i);
				}
			}
		}
		walk(tree, null, -1);
	};
}
