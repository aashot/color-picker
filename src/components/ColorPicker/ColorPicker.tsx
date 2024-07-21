import React, { useState, useCallback, MouseEvent, useRef } from "react"
import {
  Container,
  Flex,
  Box,
  Input,
  Button,
  IconButton,
  Code,
  useClipboard,
} from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons"

import { ImageCanvas } from "./ImageCanvas"
import { PickerCanvas } from "./PickerCanvas"
import { ColorPickerIcon } from "./ColorPickerIcon"
import { rgbToHex, validateUrl } from "./utils/utils"

const IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1721086130975-83605296fdbb?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

export const ColorPicker: React.FC = () => {
  const [isColorPickerActive, setIsColorPickerActive] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [currentHexCode, setCurrentHexCode] = useState("")
  const [finalHexCode, setFinalHexCode] = useState("")
  const [imageUrl, setImageUrl] = useState(IMAGE_PLACEHOLDER)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [magnifierPosition, setMagnifierPosition] = useState({
    x: 0,
    y: 0,
  })
  const [imageUrlInputValue, setImageUrlInputValue] = useState("")
  const [imageUrlError, setImageUrlError] = useState("")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const {
    onCopy,
    setValue: setCopiedValue,
    hasCopied,
  } = useClipboard(finalHexCode)

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLCanvasElement>) => {
      if (!isColorPickerActive) return

      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      })
      if (!ctx) return

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const pixel = ctx.getImageData(x, y, 1, 1).data
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2])

      requestAnimationFrame(() => {
        setIsHovering(true)
        setPosition({
          x: event.clientX - 50,
          y: event.clientY - 50,
        })
        setMagnifierPosition({ x, y })
        setCurrentHexCode(`#${hex}`)
      })
    },
    [isColorPickerActive]
  )

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setCurrentHexCode("")
  }, [])

  const handleClick = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    })
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const pixel = ctx.getImageData(x, y, 1, 1).data
    const hex = rgbToHex(pixel[0], pixel[1], pixel[2])

    setFinalHexCode(`#${hex}`)
  }, [])

  const toggleColorPicker = useCallback(() => {
    setIsColorPickerActive((prevState) => !prevState)
  }, [])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setImageUrlInputValue(event.target.value)
    },
    []
  )

  const handleLoadImage = useCallback(() => {
    if (!imageUrlInputValue) return

    if (validateUrl(imageUrlInputValue)) {
      setImageUrl(imageUrlInputValue)
      setImageUrlError("")
    } else {
      setImageUrlError("Invalid image URL. Please enter a valid URL.")
    }
  }, [imageUrlInputValue])

  const handleResetImageUrlInput = useCallback(
    () => setImageUrlInputValue(""),
    []
  )

  const handleCopyHexCode = useCallback(() => {
    setCopiedValue(finalHexCode)
    onCopy()
  }, [finalHexCode])

  return (
    <Container mt={5} centerContent>
      <IconButton
        aria-label="Toggle Color Picker"
        icon={<ColorPickerIcon />}
        transform={isColorPickerActive ? "scale(1.2)" : "unset"}
        onClick={toggleColorPicker}
      />

      <Flex alignItems="center" mt={3} gap={2}>
        <Box
          width="36px"
          height="36px"
          borderRadius="lg"
          backgroundColor={finalHexCode}
        />
        <Code padding={2} borderRadius="lg">
          {finalHexCode ? finalHexCode : "#......"}
        </Code>
        <Button onClick={handleCopyHexCode}>
          {hasCopied ? "Copied!" : "Copy"}
        </Button>
      </Flex>

      <Flex alignItems="center" gap={2} mt={3}>
        <Input
          placeholder="Type image URL"
          value={imageUrlInputValue}
          onChange={handleInputChange}
          isInvalid={!!imageUrlError}
        />
        <IconButton
          aria-label="Reset Input"
          isDisabled={!imageUrlInputValue}
          icon={<CloseIcon />}
          onClick={handleResetImageUrlInput}
        />
      </Flex>
      <Button size="sm" my={3} onClick={handleLoadImage}>
        Load Image
      </Button>
      {imageUrlError && <Code color="red.500">{imageUrlError}</Code>}
      <ImageCanvas
        imageUrl={imageUrl}
        canvasRef={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
      <PickerCanvas
        hexCode={currentHexCode}
        isHovering={isHovering}
        position={position}
        magnifierPosition={magnifierPosition}
      />
    </Container>
  )
}
