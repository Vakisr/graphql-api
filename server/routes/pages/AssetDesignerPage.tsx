import styled from "@emotion/styled";
import { Color, WidthProperty } from "csstype";
import { map, pickBy } from "lodash";
import * as React from "react";
import { Theme } from "../../schema/Theme";
import Select from "../components/Select";
import * as templates from "../templates";

interface SidebarProps {
  backgroundColor: Color;
  width: WidthProperty<string>;
}

const Sidebar = styled.aside`
  padding: 1em;
  display: inline-block;
  vertical-align: top;
  width: ${({ width }) => width};
  height: 100vh;
  position: sticky;
  background-color: ${({ backgroundColor }) => backgroundColor};
` as React.FC<SidebarProps>;
const SidebarHeader = styled.h2``;
const SidebarItem = styled.div`
  margin-top: 1em;
  margin-bottom: 1em;
`;

interface MainProps {
  width: WidthProperty<string>;
}

const Main = styled.main`
  margin-top: 1em;
  display: inline-block;
  overflow: auto;
  width: ${({ width }) => width};
` as React.FC<MainProps>;

const SelectorLabel = styled.label``;

const VariableContainer = styled.div``;

interface AssetDesignerPageProps {
  // TODO: Share the type from the backend
  selected: {
    conferenceSeriesId: string;
    conferenceId: string;
    templateId: string; // One of templates
  };
  theme: Theme;
  themes: Theme[];
}

function AssetDesignerPage({
  selected,
  theme,
  themes,
}: AssetDesignerPageProps) {
  // TODO: Type
  const template = templates[selected.templateId] || <NoTemplateFound />;
  const variables = template.variables
    ? pickBy(selected, (option, key) => template.variables.indexOf(key) >= 0)
    : {};
  const sideBarWidth = "15em";

  return (
    <article>
      <Sidebar backgroundColor={theme.colors.background} width={sideBarWidth}>
        <SidebarHeader>Asset designer</SidebarHeader>

        <SidebarItem>
          <SidebarHeader>Themes</SidebarHeader>
          <ThemeSelector themes={themes} selectedTheme={theme.id} />
        </SidebarItem>

        <SidebarItem>
          <SidebarHeader>Templates</SidebarHeader>
          <TemplateSelector
            templates={Object.keys(templates)}
            selectedTemplate={selected.templateId}
          />
        </SidebarItem>

        {variables && (
          <SidebarItem>
            <SidebarHeader>Variables</SidebarHeader>

            {map(variables, (variable, field) => (
              <VariableContainer key={field}>
                <SelectorLabel>{field}</SelectorLabel>
                <VariableSelector
                  field={field}
                  options={[]}
                  selectedVariable={variable}
                />
              </VariableContainer>
            ))}
          </SidebarItem>
        )}
      </Sidebar>
      <Main width={`calc(100% - ${sideBarWidth})`}>
        {React.createElement(template, {
          selected,
          theme,
        })}
      </Main>
    </article>
  );
}

function NoTemplateFound() {
  return <>No template found!</>;
}

interface ThemeSelectorProps {
  themes: Theme[];
  selectedTheme: Theme["id"];
}

// TODO: Add basic state management so selected theme can be changed
// without having to refresh the entire page (onChange handler +
// propagation to parent)
function ThemeSelector({ themes, selectedTheme }: ThemeSelectorProps) {
  return (
    <Select
      field="conferenceSeriesId"
      options={themes.map(theme => ({
        value: theme.id,
        label: theme.id,
      }))}
      selected={selectedTheme}
    />
  );
}

interface TemplateSelectorProps {
  templates: string[];
  selectedTemplate: string;
}

// TODO: Add basic state management so selected theme can be changed
// without having to refresh the entire page (onChange handler +
// propagation to parent)
function TemplateSelector({
  templates,
  selectedTemplate,
}: TemplateSelectorProps) {
  return (
    <Select
      field="templateId"
      options={templates.map(template => ({
        value: template,
        label: template,
      }))}
      selected={selectedTemplate}
    />
  );
}

interface VariableSelector {
  field: string;
  options: string[];
  selectedVariable: string;
}

function VariableSelector({ field, options, selectedVariable }) {
  return <Select field={field} options={options} selected={selectedVariable} />;
}

export default AssetDesignerPage;