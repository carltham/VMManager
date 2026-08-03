# Dogtail Install Procedure (Linux Mint)

This guide installs Dogtail and required accessibility dependencies for native GTK UI automation (for example, virt-manager screen investigation).

## 1) Install packages

```bash
sudo apt update
sudo apt install -y dogtail python3-pyatspi at-spi2-core gir1.2-atspi-2.0 python3-gi
```

## 2) Optional tools for headless runs and screenshots

```bash
sudo apt install -y xvfb imagemagick
```

## 3) Verify Python imports

```bash
python3 -c "import dogtail, pyatspi, gi; print('Dogtail OK')"
```

Expected output:

```text
Dogtail OK
```

## 4) Verify AT-SPI in a virtual display

```bash
xvfb-run -a python3 -c "from dogtail.tree import root; print('AT-SPI OK')"
```

Expected output:

```text
AT-SPI OK
```

## 5) Quick troubleshooting

### `ModuleNotFoundError: dogtail`

```bash
sudo apt install -y dogtail
python3 -c "import dogtail; print('dogtail import OK')"
```

### `ModuleNotFoundError: pyatspi`

```bash
sudo apt install -y python3-pyatspi at-spi2-core gir1.2-atspi-2.0
python3 -c "import pyatspi; print('pyatspi import OK')"
```

### AT-SPI runtime issues in headless mode

```bash
sudo apt install -y xvfb
xvfb-run -a python3 -c "from dogtail.tree import root; print('AT-SPI OK')"
```

## 6) Notes

- Prefer distro packages over `pip` for Dogtail on Mint/Ubuntu.
- Dogtail drives native app accessibility trees, unlike Playwright which targets web DOM.
- If you are automating screenshots, `xvfb-run` plus ImageMagick `import` is a practical combo.
