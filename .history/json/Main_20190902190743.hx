class Main {
    public static function main() {
        var a = sys.io.File.getContent("inputs.json");
        haxe.format.JsonPrinter.print(a);
    }
}