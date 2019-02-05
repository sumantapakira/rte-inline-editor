RTE plugin for inline styling (font size, font family and text color) in Touch UI AEM 6.4

Editor can change the font size or font family (Verdana/Courier/Cursive/Fantasy) or even change the color of the text. 

Steps to configure this feature in your component:
1. Add a node of type nt:unstructured called "sumanta-showcase" under rtePlugins node. For eaxmple : /apps/weretail/components/content/text/cq:editConfig/cq:inplaceEditing/config/rtePlugins/sumanta-showcase
2. Add multi field property called "features" (String) and value as "custominlineTextEdit"
3. If you want to disable any of the features then add multi field property called "disableFeatures" (String) and value as corresponding feature name e.g "./font-family". If you want to use all the features then leave it as blank. 
