import React, { useState, useEffect } from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { Rect, useRect } from './use-rect';

function mockRect(top: number, left: number, width: number, height: number) {
  const windowWidth = 1920;
  const windowHeight = 1080;
  const right = windowWidth - left - width;
  const bottom = windowHeight - top - height;
  const fakeRect: Rect = {
    bottom,
    height,
    scrollHeight: 0,
    left,
    right,
    top,
    width,
    scrollWidth: 0,
    x: left,
    y: top
  };

  jest
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockReturnValue({ ...fakeRect, toJSON: () => fakeRect });

  return fakeRect;
}

describe('useRect', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('calls dispatchChange once gets initial bounding rect', () => {
    const fakeRect = mockRect(0, 0, 100, 200);
    const dispatchChange = jest.fn();

    function Component() {
      const [rectRef] = useRect(dispatchChange);
      return <div ref={rectRef}></div>;
    }

    render(<Component />);

    expect(dispatchChange).toHaveBeenLastCalledWith(fakeRect);
  });

  it('calls dispatchChange when bounding rect changes on re-render', async () => {
    const dispatchChange = jest.fn();

    function Component() {
      const [, rerender] = useState({});
      const [rectRef] = useRect(dispatchChange);

      useEffect(() => {
        setTimeout(rerender, 10);
      });

      return <div ref={rectRef}></div>;
    }

    render(<Component />);

    const fakeRect = mockRect(0, 0, 150, 200);

    await waitFor(() => {
      expect(dispatchChange).toHaveBeenLastCalledWith(fakeRect);
    });
  });

  it('calls dispatchChange when a bounding rect changes detected on manual revalidation', async () => {
    const dispatchChange = jest.fn();

    function Component() {
      const [rectRef, revalidateRect] = useRect(dispatchChange);

      return (
        <>
          <div ref={rectRef}></div>
          <button onClick={() => revalidateRect()} />
        </>
      );
    }

    render(<Component />);

    const fakeRect = mockRect(0, 0, 100, 300);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(dispatchChange).toHaveBeenLastCalledWith(fakeRect);
    });
  });

  it('calls dispatchChange when a bounding rect has not changed on manual revalidation but force option passed', async () => {
    const dispatchChange = jest.fn();

    function Component() {
      const [rectRef, revalidateRect] = useRect(dispatchChange);

      return (
        <>
          <div ref={rectRef}></div>
          <button onClick={() => revalidateRect({ force: true })} />
        </>
      );
    }

    render(<Component />);

    const fakeRect = mockRect(0, 0, 100, 300);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(dispatchChange).toHaveBeenNthCalledWith(3, fakeRect);
    });
  });

  it('works well with useState', async () => {
    const fakeRect = mockRect(10, 20, 425, 40);

    function Component() {
      const [rect, setRect] = useState<Rect | undefined>();
      const [rectRef] = useRect(setRect);

      return <div ref={rectRef}>{rect && rect.width}</div>;
    }

    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText(fakeRect.width)).toBeDefined();
    });
  });
});
