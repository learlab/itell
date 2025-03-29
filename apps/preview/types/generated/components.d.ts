import type { Schema, Struct } from '@strapi/strapi';

export interface PageChunk extends Struct.ComponentSchema {
  collectionName: 'components_page_chunks';
  info: {
    description: '';
    displayName: 'Chunk';
  };
  attributes: {
    CleanText: Schema.Attribute.Text & Schema.Attribute.DefaultTo<'not set'>;
    ConstructedResponse: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.constructedResponse'>;
    Header: Schema.Attribute.String & Schema.Attribute.Required;
    HeaderLevel: Schema.Attribute.Enumeration<['H2', 'H3', 'H4']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'H2'>;
    KeyPhrase: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.keyPhrase'>;
    MD: Schema.Attribute.Text;
    MDX: Schema.Attribute.Text & Schema.Attribute.DefaultTo<'not set'>;
    Question: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.generatedQuestion'>;
    QuestionAnswerResponse: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.question'>;
    ShowHeader: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    Slug: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.slug'>;
    Text: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
  };
}

export interface PagePlainChunk extends Struct.ComponentSchema {
  collectionName: 'components_page_plain_chunks';
  info: {
    description: '';
    displayName: 'Plain-Chunk';
    icon: 'dashboard';
  };
  attributes: {
    CleanText: Schema.Attribute.Text & Schema.Attribute.DefaultTo<'not set'>;
    Header: Schema.Attribute.String & Schema.Attribute.Required;
    HeaderLevel: Schema.Attribute.Enumeration<['H2', 'H3', 'H4']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'H2'>;
    MD: Schema.Attribute.Text;
    MDX: Schema.Attribute.Text & Schema.Attribute.DefaultTo<'not set'>;
    ShowHeader: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    Slug: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.slug'>;
    Text: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
  };
}

export interface PageVideo extends Struct.ComponentSchema {
  collectionName: 'components_page_videos';
  info: {
    description: '';
    displayName: 'Video';
  };
  attributes: {
    CleanText: Schema.Attribute.Text;
    ConstructedResponse: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.constructedResponse'>;
    Description: Schema.Attribute.Text;
    EndTime: Schema.Attribute.Integer;
    Header: Schema.Attribute.String & Schema.Attribute.Required;
    KeyPhrase: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.keyPhrase'>;
    MD: Schema.Attribute.Text;
    MDX: Schema.Attribute.Text;
    Question: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.generatedQuestion'>;
    QuestionAnswerResponse: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.question'>;
    Slug: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.slug'>;
    StartTime: Schema.Attribute.Integer;
    URL: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface QuizzesGeneratedMcq extends Struct.ComponentSchema {
  collectionName: 'components_quizzes_generated_mcqs';
  info: {
    displayName: 'GeneratedMCQ';
  };
  attributes: {
    GeneratedQuestion: Schema.Attribute.Text &
      Schema.Attribute.CustomField<'plugin::auto-content.mcqGenerator'>;
  };
}

export interface QuizzesMultipleChoiceOption extends Struct.ComponentSchema {
  collectionName: 'components_quizzes_multiple_choice_options';
  info: {
    description: '';
    displayName: 'MultipleChoiceOption';
    icon: 'bulletList';
  };
  attributes: {
    IsCorrect: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    Text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface QuizzesMultipleChoiceQuestion extends Struct.ComponentSchema {
  collectionName: 'components_quizzes_multiple_choice_questions';
  info: {
    description: '';
    displayName: 'MultipleChoiceQuestion';
    icon: 'bulletList';
  };
  attributes: {
    Answers: Schema.Attribute.Component<'quizzes.multiple-choice-option', true>;
    Question: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'page.chunk': PageChunk;
      'page.plain-chunk': PagePlainChunk;
      'page.video': PageVideo;
      'quizzes.generated-mcq': QuizzesGeneratedMcq;
      'quizzes.multiple-choice-option': QuizzesMultipleChoiceOption;
      'quizzes.multiple-choice-question': QuizzesMultipleChoiceQuestion;
    }
  }
}
