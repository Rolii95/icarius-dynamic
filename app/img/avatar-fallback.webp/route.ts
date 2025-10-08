const base64Avatar =
  "UklGRjIEAABXRUJQVlA4ICYEAAAwGwCdASqgAKAAPm00k0ekIyGhKfrYeIANiWNu4XKQ2JiamP6LjvYd8gBbjb7eYD9nOon/ivUA/pPUHehB0of7pZS94gjlXYDKCci0QOM7vBvjnQef43iL1Buj3+zvsoEMe/R7pqgt6NuXekG/uXuXnjj//acZcV39mPVd31lOOGs7WQg9Fb4X36V2SCzGPfdywMXNLUc/T2umcF8z1QPEfZR1cXXR0CHbjDylps0jBtQXRk5eJuAAlS/juGLwoZ6kxYpEGaZvOYky0HKZ6AK/6JGrZ5JsUm8+uD0ne1t+S2vAAP7/LRm91lARuoAD33ezVCt0OERGPBoMK/lwjSAaBDceE5/tKFjBv9goEGrT8isSFmo4orD/77ywBOEjMEmF9Tx1GCZ3Yv0jMQOCG/Gl/IUq6Qx5CEbnnCEC8pzLON9Tx1uZ+kS+U92Ytcuque+Asrhez7v6C9KpM4Sl8embhhoXel5Bp7DuJpjtz9LqIVQULC8x2pukhJk33On8PUixbnnXOUh3eEiKAOHbIncyu3707P/wZ2CXK27Gn+Cb5O1iFwwelajnfMwT+pHA04eYQRBP8Dn+082cRI+XCX8212U03uqWNaFmHNttJO9yDcHml3EtU0h/RQmc8TWwOlOMdZH1tXHeYcwag0QtNM6IEVY9fA/mCC1fC1fjiNOSKLroSlwYqJqh4wsf4S0jQi95ZIqAnuspUBVBA/pNva+djLIDS0ZBTZXKcUeD4/R4h9cSvbJ9v/Uy/Wv5WJgNJKY6sbGigdRj8HydtwzVlRASHxOeOR0ob9X69B1+wog6ME/hmRT+R7PPbL6SVZJ9KjOi+Gw9zbAXHa4VkOa/oKzJGgV8bEimaQxQqOzVlRASGY0M0BTjnuPjYTBLej/W3lQAoD9q7MmnChner3dHzUHCH8zkyAiLaP2X7S6sQ5uaJJjpUZ8xPzybAr5qSRL6n18aU0Nd71J+BhTLTqxjexZohJbjssEqpILfADK0iXGIlKLdZL0CEv/FQBMvivb/LAiF6HH4fCNdFogw0AKiko/rtVcszFw9Mcu6q1D0hR+6ykQhyAidSqXQUtxDvoOmIde34gW5gPDz3vvp58DdftG58vPLTAgGt02yBXdpOsDcWqVPlpXa/UDjhpZRT9veWGGBZMcmKzj1BKviWZL69b8bGL9fcxXy288f0l30vnPKxXO/nfCGyHgL5bHaihrw7qGiP/Web63v48S44mk6Mm/bHjPxLZQ6zF4YUOhJ8zsu/aLi6JNSAqjRRvcSg4ZQspq5poddU3AYW1aCpA2WVKOr2WMdaqZ2JPn23UL54kjZcptpej5QPuiYGXF4wDzHT6mFo0o0pn4NIaPA+wCsgimhQceOzmFCYouyPDLARv2SkPCnFmRXEpig8ZDAIDwja25TAAAAAA=";

export const dynamic = "force-static";
export const revalidate = 31_536_000; // 1 year

export function GET() {
  const body = Buffer.from(base64Avatar, "base64");

  return new Response(body, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": body.byteLength.toString(),
    },
  });
}
