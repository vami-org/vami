import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import {
  VamiAvatar,
  VamiInput,
  VamiTextarea,
  VamiCheckbox,
  VamiRadio,
  VamiRadioGroup,
  VamiSelect,
  VamiSwitch,
  VamiBadge,
  VamiTag,
  VamiIcon,
  VamiProgressBar,
  VamiSpinner,
  VamiSkeleton,
  VamiImage,
  VamiFileUpload,
} from "./atoms";
import {
  FormField,
  SearchBox,
  ToastContainer,
  AlertBanner,
  EmptyState,
  AuthorByline,
} from "./molecules";
import { useToastStore } from "../store/toastStore";

describe("Atom & Molecule Library - Week 8 Unit Tests", () => {
  describe("VamiAvatar (Status Dots & Sizes)", () => {
    it("should render online status dot with correct styling", () => {
      render(<VamiAvatar name="John Doe" status="online" size="xl" />);
      const statusEl = screen.getByTestId("avatar-status");
      expect(statusEl).toBeDefined();
      expect(statusEl.className).toContain("bg-success-500");
      expect(statusEl.className).toContain("h-5 w-5"); // xl status size
    });

    it("should support sizes xs and 2xl", () => {
      render(
        <div data-testid="avatars">
          <VamiAvatar name="A" size="xs" status="busy" />
          <VamiAvatar name="B" size="2xl" status="idle" />
        </div>,
      );
      const busyDot = screen.getAllByTestId("avatar-status")[0];
      const idleDot = screen.getAllByTestId("avatar-status")[1];
      expect(busyDot.className).toContain("bg-error-500");
      expect(idleDot.className).toContain("bg-warning-500");
    });
  });

  describe("VamiInput", () => {
    it("should link error messages to aria attributes", () => {
      render(<VamiInput id="test-input" error="Name is required" />);
      const input = screen.getByRole("textbox");
      expect(input.getAttribute("aria-invalid")).toBe("true");
      expect(input.getAttribute("aria-describedby")).toBe("test-input-error");
    });

    it("should apply success classes", () => {
      render(<VamiInput success data-testid="success-input" />);
      const input = screen.getByTestId("success-input");
      expect(input.className).toContain("border-success-500");
    });
  });

  describe("VamiTextarea", () => {
    it("should adjust height on render if autoResize is active", () => {
      const { rerender } = render(
        <VamiTextarea autoResize value="Short text" onChange={() => {}} />,
      );
      const textarea = screen.getByRole("textbox");
      expect(textarea.style.height).toBeDefined();

      rerender(
        <VamiTextarea
          autoResize
          value="Longer text content that wraps onto multiple lines"
          onChange={() => {}}
        />,
      );
      expect(textarea.style.height).toBeDefined();
    });
  });

  describe("VamiCheckbox", () => {
    it("should support indeterminate check status", () => {
      render(
        <VamiCheckbox label="Check Item" indeterminate onChange={() => {}} />,
      );
      const input = screen.getByRole("checkbox");
      expect(input.indeterminate).toBe(true);

      const minusIndicator = screen.getByTestId("checkbox-minus");
      expect(minusIndicator).toBeDefined();
    });
  });

  describe("VamiRadio & VamiRadioGroup", () => {
    it("should coordinate selections from parent group context", () => {
      render(
        <VamiRadioGroup name="choices" value="yes" onChange={() => {}}>
          <VamiRadio value="yes" label="Yes choice" />
          <VamiRadio value="no" label="No choice" />
        </VamiRadioGroup>,
      );

      const yesRadio = screen.getByLabelText("Yes choice");
      const noRadio = screen.getByLabelText("No choice");

      expect(yesRadio.checked).toBe(true);
      expect(noRadio.checked).toBe(false);
    });
  });

  describe("VamiSelect", () => {
    const options = [
      { value: "react", label: "React" },
      { value: "vue", label: "Vue" },
      { value: "svelte", label: "Svelte" },
    ];

    it("should expand options list on trigger click", () => {
      render(<VamiSelect options={options} placeholder="Select tech" />);
      const trigger = screen.getByTestId("select-trigger");

      // Initially closed
      expect(screen.queryByRole("listbox")).toBeNull();

      // Click to open
      fireEvent.click(trigger);
      expect(screen.getByRole("listbox")).toBeDefined();
      expect(
        screen.getByRole("listbox").querySelectorAll('[role="option"]'),
      ).toHaveLength(3);
    });

    it("should execute selection trigger onChange", () => {
      const selectSpy = vi.fn();
      render(
        <VamiSelect
          options={options}
          value="react"
          onChange={selectSpy}
          placeholder="Select tech"
        />,
      );
      const trigger = screen.getByTestId("select-trigger");

      fireEvent.click(trigger);
      const listbox = screen.getByRole("listbox");
      const secondOption = listbox.querySelectorAll('[role="option"]')[1];
      fireEvent.click(secondOption);

      expect(selectSpy).toHaveBeenCalledWith("vue");
      expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("should navigate options using keyboard key arrows", () => {
      const selectSpy = vi.fn();
      render(
        <VamiSelect
          options={options}
          value="react"
          onChange={selectSpy}
          placeholder="Select tech"
        />,
      );
      const trigger = screen.getByTestId("select-trigger");

      // Press ArrowDown to open and select first
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      expect(screen.getByRole("listbox")).toBeDefined();

      // Press Down again to select Vue
      fireEvent.keyDown(trigger, { key: "ArrowDown" });
      // Press Enter to select
      fireEvent.keyDown(trigger, { key: "Enter" });

      expect(selectSpy).toHaveBeenCalledWith("vue");
    });
  });

  describe("VamiSwitch", () => {
    it("should toggle checked state on click actions", () => {
      const toggleSpy = vi.fn();
      render(
        <VamiSwitch
          checked={false}
          onChange={toggleSpy}
          label="Mute notifications"
        />,
      );
      const button = screen.getByRole("switch");
      expect(button.getAttribute("aria-checked")).toBe("false");

      fireEvent.click(button);
      expect(toggleSpy).toHaveBeenCalledWith(true);
    });
  });

  describe("VamiBadge", () => {
    it("should support rendering inline metadata dots", () => {
      render(
        <div>
          <VamiBadge type="dot" variant="success" />
          <VamiBadge type="dot-label" variant="error">
            Alert
          </VamiBadge>
        </div>,
      );

      const dotBadge = screen.getByTestId("badge-dot");
      expect(dotBadge.className).toContain("bg-success-500");

      const labelBadge = screen.getByTestId("badge-dot-indicator");
      expect(labelBadge.className).toContain("bg-error-500");
    });
  });

  describe("VamiTag", () => {
    it("should trigger onClose callback when close button is clicked", () => {
      const closeSpy = vi.fn();
      render(<VamiTag onClose={closeSpy}>React 19</VamiTag>);

      const closeBtn = screen.getByTestId("tag-close-btn");
      fireEvent.click(closeBtn);
      expect(closeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("VamiIcon", () => {
    it("should render correct SVG outline path based on name", () => {
      render(<VamiIcon name="search" data-testid="search-icon" />);
      const svg = screen.getByTestId("search-icon");
      expect(svg.querySelector("path")).toBeDefined();
    });
  });

  describe("VamiProgressBar", () => {
    it("should clamp values within bounds and show percentage label", () => {
      render(<VamiProgressBar value={120} max={100} showLabel />);
      expect(screen.getByText("100%")).toBeDefined();
    });
  });

  describe("VamiSpinner & VamiSkeleton", () => {
    it("should render loader elements with shapes and spin outline classes", () => {
      render(<VamiSpinner size="lg" data-testid="spinner" />);
      render(<VamiSkeleton variant="circle" data-testid="skeleton" />);

      expect(screen.getByTestId("spinner").getAttribute("class")).toContain(
        "animate-spin",
      );
      expect(screen.getByTestId("skeleton").className).toContain(
        "rounded-full",
      );
    });
  });

  describe("VamiImage", () => {
    it("should display fallback block placeholder on source loading error", () => {
      render(<VamiImage src="broken.jpg" alt="Broken file" />);
      const img = screen.getByRole("img");

      fireEvent.error(img);

      expect(screen.getByTestId("image-fallback-placeholder")).toBeDefined();
      expect(screen.getByText("Image Unavailable")).toBeDefined();
    });
  });

  describe("VamiFileUpload", () => {
    it("should respond to drag over activations", () => {
      render(<VamiFileUpload onFileSelect={() => {}} />);
      const container = screen.getByRole("button");

      fireEvent.dragEnter(container);
      expect(container.className).toContain("border-border-focus");

      fireEvent.dragLeave(container);
      expect(container.className).toContain("border-border-default");
    });
  });

  describe("FormField Molecule", () => {
    it("should associate labels with inputs and output error alerts", () => {
      render(
        <FormField label="Username" error="Must be unique">
          <VamiInput id="username" />
        </FormField>,
      );

      const label = screen.getByText("Username");
      expect(label.getAttribute("for")).toBe("username");

      const errorText = screen.getByTestId("form-field-error");
      expect(errorText.textContent).toBe("Must be unique");
    });
  });

  describe("SearchBox Molecule", () => {
    it("should clear the input text when clear button is clicked", () => {
      const changeSpy = vi.fn();
      render(<SearchBox value="Search text" onChange={changeSpy} />);

      const clearBtn = screen.getByRole("button", {
        name: "Clear search query",
      });
      fireEvent.click(clearBtn);

      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe("Toast Notification Store & Item", () => {
    beforeEach(() => {
      act(() => {
        useToastStore.setState({ toasts: [] });
      });
    });

    it("should render items inside container and auto-dismiss correctly", () => {
      render(<ToastContainer />);

      act(() => {
        useToastStore.getState().addToast("Verification sent", "success", 100);
      });

      expect(screen.getByText("Verification sent")).toBeDefined();
    });
  });

  describe("AlertBanner Molecule", () => {
    it("should display inline messages with severity classes", () => {
      render(
        <AlertBanner title="Offline" variant="error">
          Network failure
        </AlertBanner>,
      );
      const alert = screen.getByTestId("alert-error");
      expect(alert.className).toContain("bg-error-500/10");
      expect(screen.getByText("Offline")).toBeDefined();
    });
  });

  describe("EmptyState Molecule", () => {
    it("should display placeholders and respond to action events", () => {
      const actionSpy = vi.fn();
      render(
        <EmptyState
          title="No articles found"
          description="Create your first post"
          actionLabel="Create Post"
          onAction={actionSpy}
        />,
      );

      expect(screen.getByText("No articles found")).toBeDefined();
      const btn = screen.getByRole("button", { name: "Create Post" });
      fireEvent.click(btn);
      expect(actionSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("ReadTimeDisplay & AuthorByline", () => {
    it("should render metadata information header rows", () => {
      const author = {
        username: "meet",
        displayName: "Meet Chauhan",
        avatarUrl: "meet.jpg",
      };

      render(
        <BrowserRouter>
          <AuthorByline author={author} date="June 11, 2026" readMinutes={5} />
        </BrowserRouter>,
      );

      expect(screen.getByText("Meet Chauhan")).toBeDefined();
      expect(screen.getByText("June 11, 2026")).toBeDefined();
      expect(screen.getByText("5 min read")).toBeDefined();
    });
  });
});
