import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {
  VamiText,
  VamiHeading,
  VamiCaption,
  VamiLabel,
  VamiCode,
  VamiIconButton,
  VamiLink,
  VamiBox,
  VamiStack,
  VamiRow,
  VamiGrid,
  VamiDivider,
  VamiSpacer,
} from "./atoms";

describe("Atom Component Library Unit Tests", () => {
  describe("VamiText", () => {
    it("should render children text correctly", () => {
      render(<VamiText>Hello Text</VamiText>);
      expect(screen.getByText("Hello Text")).toBeDefined();
    });

    it("should support custom tag elements using the 'as' prop", () => {
      render(<VamiText as="p">Paragraph Text</VamiText>);
      const el = screen.getByText("Paragraph Text");
      expect(el.tagName).toBe("P");
    });

    it("should apply correct class variations for size, weight, alignment, and truncation", () => {
      render(
        <VamiText size="lg" weight="bold" align="center" truncate>
          Classtest
        </VamiText>,
      );
      const el = screen.getByText("Classtest");
      expect(el.className).toContain("text-lg");
      expect(el.className).toContain("font-bold");
      expect(el.className).toContain("text-center");
      expect(el.className).toContain("truncate");
    });
  });

  describe("VamiHeading", () => {
    it("should render h1 by default", () => {
      render(<VamiHeading>Heading 1</VamiHeading>);
      const el = screen.getByText("Heading 1");
      expect(el.tagName).toBe("H1");
      expect(el.className).toContain("text-4xl");
    });

    it("should respect header level and map to default sizes", () => {
      render(<VamiHeading level={3}>Heading 3</VamiHeading>);
      const el = screen.getByText("Heading 3");
      expect(el.tagName).toBe("H3");
      expect(el.className).toContain("text-2xl");
    });

    it("should allow visual size overrides using size prop", () => {
      render(
        <VamiHeading level={1} size="xl">
          Heading xl
        </VamiHeading>,
      );
      const el = screen.getByText("Heading xl");
      expect(el.className).toContain("text-xl");
    });
  });

  describe("VamiCaption", () => {
    it("should render caption metadata style", () => {
      render(<VamiCaption>Sub-caption text</VamiCaption>);
      const el = screen.getByText("Sub-caption text");
      expect(el.className).toContain("text-xs");
      expect(el.className).toContain("text-ink-400");
    });
  });

  describe("VamiLabel", () => {
    it("should render label with htmlFor target", () => {
      render(<VamiLabel htmlFor="input_id">Form label</VamiLabel>);
      const el = screen.getByText("Form label");
      expect(el.tagName).toBe("LABEL");
      expect(el.getAttribute("for")).toBe("input_id");
    });
  });

  describe("VamiCode", () => {
    it("should render code wrapper with monospace class", () => {
      render(<VamiCode>{"const foo = 'bar'"}</VamiCode>);
      const el = screen.getByText("const foo = 'bar'");
      expect(el.tagName).toBe("CODE");
      expect(el.className).toContain("font-mono");
    });
  });

  describe("VamiIconButton", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it("should trigger click handlers and show children", () => {
      const clickSpy = vi.fn();
      render(
        <VamiIconButton aria-label="Settings" onClick={clickSpy}>
          ⚙️
        </VamiIconButton>,
      );
      const btn = screen.getByRole("button", { name: "Settings" });
      fireEvent.click(btn);
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it("should show loader spin when loading", () => {
      render(
        <VamiIconButton aria-label="Loading" isLoading>
          ⚙️
        </VamiIconButton>,
      );
      const btn = screen.getByRole("button", { name: "Loading" });
      expect(btn.querySelector("svg")).toBeDefined();
      expect(btn.disabled).toBe(true);
    });

    it("should warn in development console if aria-label is missing", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Mock import.meta.env.DEV as true
      const originalDev = import.meta.env.DEV;
      import.meta.env.DEV = true;

      render(<VamiIconButton>❌</VamiIconButton>);

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("Missing required accessibility prop"),
      );

      // Restore
      import.meta.env.DEV = originalDev;
      warnSpy.mockRestore();
    });
  });

  describe("VamiLink", () => {
    it("should render react-router-dom Link for internal routes", () => {
      render(
        <BrowserRouter>
          <VamiLink to="/home">Home Link</VamiLink>
        </BrowserRouter>,
      );
      const link = screen.getByRole("link", { name: "Home Link" });
      expect(link.getAttribute("href")).toBe("/home");
    });

    it("should render standard anchor tag for external websites", () => {
      render(<VamiLink href="https://vami.org">External Link</VamiLink>);
      const link = screen.getByRole("link", { name: "External Link" });
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noreferrer");
      expect(link.getAttribute("href")).toBe("https://vami.org");
    });
  });

  describe("VamiBox", () => {
    it("should map padding, margin, radius, background and shadow props to CSS custom variables", () => {
      render(
        <VamiBox
          padding={4}
          margin={2}
          bg="elevated"
          radius="md"
          shadow="sm"
          border="default"
          data-testid="box"
        >
          Box item
        </VamiBox>,
      );
      const el = screen.getByTestId("box");
      expect(el.className).toContain("bg-surface-elevated");
      expect(el.className).toContain("border-border-default");
      expect(el.style.padding).toBe("var(--space-4)");
      expect(el.style.margin).toBe("var(--space-2)");
      expect(el.style.borderRadius).toBe("var(--radius-md)");
      expect(el.style.boxShadow).toBe("var(--shadow-sm)");
    });
  });

  describe("VamiStack", () => {
    it("should render flex column stack with gap", () => {
      render(
        <VamiStack gap={3} align="center" justify="between" data-testid="stack">
          <div>A</div>
          <div>B</div>
        </VamiStack>,
      );
      const el = screen.getByTestId("stack");
      expect(el.className).toContain("flex-col");
      expect(el.className).toContain("items-center");
      expect(el.className).toContain("justify-between");
      expect(el.style.gap).toBe("var(--space-3)");
    });
  });

  describe("VamiRow", () => {
    it("should render flex row with gap and wrap", () => {
      render(
        <VamiRow gap={4} wrap align="start" justify="around" data-testid="row">
          <div>1</div>
          <div>2</div>
        </VamiRow>,
      );
      const el = screen.getByTestId("row");
      expect(el.className).toContain("flex-row");
      expect(el.className).toContain("items-start");
      expect(el.className).toContain("justify-around");
      expect(el.className).toContain("flex-wrap");
      expect(el.style.gap).toBe("var(--space-4)");
    });
  });

  describe("VamiGrid", () => {
    it("should render grid template columns correctly", () => {
      render(
        <VamiGrid cols={3} gap={6} data-testid="grid">
          <div>X</div>
          <div>Y</div>
        </VamiGrid>,
      );
      const el = screen.getByTestId("grid");
      expect(el.className).toContain("grid");
      expect(el.style.gridTemplateColumns).toBe("repeat(3, minmax(0, 1fr))");
      expect(el.style.gap).toBe("var(--space-6)");
    });
  });

  describe("VamiDivider", () => {
    it("should support horizontal separator metrics", () => {
      render(<VamiDivider orientation="horizontal" />);
      const el = screen.getByRole("separator");
      expect(el.className).toContain("w-full");
      expect(el.getAttribute("aria-orientation")).toBe("horizontal");
    });

    it("should support vertical separator metrics", () => {
      render(<VamiDivider orientation="vertical" />);
      const el = screen.getByRole("separator");
      expect(el.className).toContain("border-l");
      expect(el.getAttribute("aria-orientation")).toBe("vertical");
    });
  });

  describe("VamiSpacer", () => {
    it("should render vertical spacers", () => {
      render(<VamiSpacer size={8} axis="vertical" data-testid="v-spacer" />);
      const el = screen.getByTestId("v-spacer");
      expect(el.style.display).toBe("block");
      expect(el.style.height).toBe("var(--space-8)");
      expect(el.style.width).toBe("1px");
    });

    it("should render horizontal spacers", () => {
      render(<VamiSpacer size={5} axis="horizontal" data-testid="h-spacer" />);
      const el = screen.getByTestId("h-spacer");
      expect(el.style.display).toBe("inline-block");
      expect(el.style.width).toBe("var(--space-5)");
      expect(el.style.height).toBe("1px");
    });
  });
});
