class Axis {
    static readonly X = 'x';
    static readonly Y = 'y';
}

class Category {
    static readonly Integrity = new Category('#ff9896', 0);
    static readonly Capacity = new Category('#ffbb78', 1);
    static readonly Reliability = new Category('#ffbb78', 1);
    static readonly Window = new Category('#98df8a', 2);
    static readonly Default = new Category('#ff9896', -1);

    color: string; priority: number;
    private constructor(color: string, priority: number) {
        this.color = color;
        this.priority = priority;
    }
}

class Type {
    static readonly Min = 'min';
    static readonly Max = 'max';
}

export { Axis, Category, Type };