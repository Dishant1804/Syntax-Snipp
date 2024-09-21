import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Snippet = {
  id: string;
  title: string;
  description: string;
  content : string;
  language: string;
  favorite : boolean;
  user: {
    username: string;
  };
  tags: string[];
};

interface SnippetState {
  selectedSnippet: Snippet | null;
}

const initialState: SnippetState = {
  selectedSnippet: null,
};

const snippetSlice = createSlice({
  name: 'snippet',
  initialState,
  reducers: {
    setSelectedSnippet(state, action: PayloadAction<Snippet>) {
      state.selectedSnippet = action.payload;
    },
  },
});

export const { setSelectedSnippet } = snippetSlice.actions;
export default snippetSlice.reducer;