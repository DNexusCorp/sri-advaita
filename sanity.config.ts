import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { course, notice, gallery } from './sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'Sri Advaita Educational Trust Studio',

  projectId: process.env.PUBLIC_SANITY_PROJECT_ID || 'your_project_id_here',
  dataset: process.env.PUBLIC_SANITY_DATASET || 'production',

  plugins: [structureTool()],

  schema: {
    types: [course, notice, gallery],
  },
});
