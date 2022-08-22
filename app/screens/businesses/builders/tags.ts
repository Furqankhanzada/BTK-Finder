import { Maybe, Tag, TagConnection } from '../../../models/graphql';

export const buildTags = (tags: Maybe<TagConnection>): Tag[] => {
  let alterTags: Tag[] = [];
  tags?.nodes?.forEach((node) => {
    if (node) {
      alterTags.push(node);
    }
  });
  return alterTags;
};
