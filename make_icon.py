import struct
import zlib

def make_png(w, h, color):
    def chunk(tag, data):
        c = zlib.crc32(tag + data) & 0xffffffff
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)
    raw = b''.join(b'\x00' + bytes(color) * w for _ in range(h))
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    return (
        b'\x89PNG\r\n\x1a\n' +
        chunk(b'IHDR', ihdr) +
        chunk(b'IDAT', zlib.compress(raw)) +
        chunk(b'IEND', b'')
    )

with open('assets/icon.png', 'wb') as f:
    f.write(make_png(1024, 1024, [15, 15, 15]))

print("icon.png created")
